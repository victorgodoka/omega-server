export const paginateArray = (array, page = 1, limit = 24) => {
  const total = array.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: array.slice((page - 1) * limit, page * limit),
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1
  };
};
