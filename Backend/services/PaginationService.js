
exports.addPaginationProperties = async function (collection, total, request) {
    let page = getPage(request) - 1;
    let pageSize = getPageSize(request, total);

    if (page < 0)
        page = 0;

    if (total === 0 && pageSize === 0) {
        pageSize = 15;
    }

    let json = {}
    json.data = collection

    json.meta = {
        current_page: page + 1,
        page_size: pageSize,
        total: total
    };
    return json;
}

exports.getQuery = async (request) => {
    let page = getPage(request) - 1;
    let pageSize = getPageSize(request, 15);

    return {offset: page * pageSize, limit: pageSize}
}

function getPage(request) {
    let {page} = request.query;
    if (!page) return 0;
    return Number(page);
}

function getPageSize(request, total) {
    let {pageSize} = request.query;
    if (!pageSize) return Number(total)
    return Number(pageSize);
}