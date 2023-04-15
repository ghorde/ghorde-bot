export const paginate = <T>(
    notes: T[],
    pageLength: number,
    pageNumber: number
) => {
    const page = notes.slice(
        (pageNumber - 1) * pageLength,
        pageLength * pageNumber
    );
    return page;
};