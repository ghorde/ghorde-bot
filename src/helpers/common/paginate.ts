export const paginate = (items: any[], page = 1, page_size = 10) => {
    const offset = (page - 1) * page_size;
    const paginatedItems = items.slice(offset).slice(0, page_size);
    const total_pages = Math.ceil(items.length / page_size);

    return {
        page,
        per_page: page_size,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: items.length,
        total_pages,
        data: paginatedItems
    };
}