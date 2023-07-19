const pagination = (persistPage = 1, persistLimit = 12) => {
    const parsePage = parseInt(persistPage);
    const parseLimit = parseInt(persistLimit);
    const page = parsePage >= 1 ? parsePage : 1;
    const limit = parseLimit > 1 && parseLimit < 12 ? parseLimit : 12;
    const skip = (page - 1) * limit;

    return {page, limit, skip}
}

module.exports = pagination;