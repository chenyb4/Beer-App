const collect = require('collect.js')

exports.addPaginationProperties = async function (collection, total, request) {
    let page = getPage(request) - 1;
    let pageSize = getPageSize(request, total);

    if (page < 0)
        page = 0;

    if (total === 0 && pageSize === 0) {
        pageSize = 15;
    }

    let pageContent = collect(collection).skip(page * pageSize).take(pageSize);

    let json = {}
    json.data = pageContent

    json.meta = {
        current_page: page + 1,
        page_size: pageSize,
        total: total
    };
    return json;
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