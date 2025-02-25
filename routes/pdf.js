import pdfFiller from 'pdffiller'
import path from 'path'
import { decode, encode } from '../utils/converter.js';
import { decodeDeck, getDataOmega } from '../utils/setcodes.js';
import express from 'express'
const __dirname = path.resolve();
const router = express.Router();

router.get('/', async (req, res) => {
  const { deck, name, lastName, cardGameID, month, day, year, country, event } = req.query;

  if (!deck) res.status(500).send({ success: false, error: "Missing field 'deck'" })
  if (!name) res.status(500).send({ success: false, error: "Missing field 'name'" })
  if (!lastName) res.status(500).send({ success: false, error: "Missing field 'lastName'" })
  if (!cardGameID) res.status(500).send({ success: false, error: "Missing field 'cardGameID'" })
  if (!month) res.status(500).send({ success: false, error: "Missing field 'month'" })
  if (!day) res.status(500).send({ success: false, error: "Missing field 'day'" })
  if (!year) res.status(500).send({ success: false, error: "Missing field 'year'" })
  if (!country) res.status(500).send({ success: false, error: "Missing field 'country'" })
  if (!event) res.status(500).send({ success: false, error: "Missing field 'event'" })

  const sourcePDF = path.join(__dirname, 'utils/KDE_DeckList.pdf')
  const outputPDF = path.join(__dirname, 'utils/KDE_DeckList_filled.pdf')

  try {
    const { mainSize, sideSize, passwords } = decode(deck)
    const mainDeck = (await getDataOmega(passwords.slice(0, mainSize))).data
    const sideDeck = (await getDataOmega(passwords.slice(-sideSize))).data

    const otherFields = {
      'First  Middle Names': name,
      'Last Name Initial': lastName[0].toUpperCase(),
      'Last Names': lastName,
      'Country of Residency': country,
      'CARD GAME ID': cardGameID,
      'Event Name': event,
      'Event Date - Month': month,
      'Event Date - Day': day,
      'Event Date - Year': year,
      'Main Deck Total': mainDeck.filter(c => !c.isExtra).reduce((a, b) => b.qtd + a, 0),
      'Total Monster Cards': mainDeck.filter(c => !c.isExtra && !c.isSpell && !c.isTrap).reduce((a, b) => b.qtd + a, 0),
      'Total Spell Cards': mainDeck.filter(c => c.isSpell).reduce((a, b) => b.qtd + a, 0),
      'Total Trap Cards': mainDeck.filter(c => c.isTrap).reduce((a, b) => b.qtd + a, 0),
      'Total Extra Deck': mainDeck.filter(c => c.isExtra).reduce((a, b) => b.qtd + a, 0),
      'Total Side Deck': sideDeck.reduce((a, b) => b.qtd + a, 0),
    }

    const sideDeckField = sideDeck.map(({ name, qtd }, i) => ({
      [`Side Deck ${i + 1}`]: `${name}   `,
      [`Side Deck ${i + 1} Count`]: `${qtd}`,
    }))

    const monstersField = mainDeck.filter(c => !c.isExtra && !c.isSpell && !c.isTrap).map(({ name, qtd }, i) => ({
      [`Monster ${i + 1}`]: `${name}   `,
      [`Monster Card ${i + 1} Count`]: `${qtd}`,
    }))

    const extraField = mainDeck.filter(c => c.isExtra && !c.isSpell && !c.isTrap).map(({ name, qtd }, i) => ({
      [`Extra Deck ${i + 1}`]: `${name}   `,
      [`Extra Deck ${i + 1} Count`]: `${qtd}`,
    }))

    const spellsField = mainDeck.filter(c => c.isSpell).map(({ name, qtd }, i) => ({
      [`Spell ${i + 1}`]: `${name}   `,
      [`Spell Card ${i + 1} Count`]: `${qtd}`,
    }))

    const trapsField = mainDeck.filter(c => c.isTrap).map(({ name, qtd }, i) => ({
      [`Trap ${i + 1}`]: `${name}   `,
      [`Trap Card ${i + 1} Count`]: `${qtd}`,
    }))

    pdfFiller.fillForm(sourcePDF, outputPDF, Object.assign({}, ...sideDeckField, ...spellsField, ...trapsField, ...monstersField, ...extraField, otherFields), function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao preencher o PDF');
      }

      // Envia o PDF preenchido para o cliente
      res.sendFile(outputPDF, (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo:', err);
          res.status(500).send('Erro ao enviar o arquivo');
        }
      });
    });
  } catch (err) {
    console.error('Erro ao enviar o arquivo:', err);
    res.status(500).send({ success: false, error: 'Wrong deck code.' });
  }

  // return res.status(500).send('Erro ao preencher o PDF');
})

export default router