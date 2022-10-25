const getTweetTemplate = (link: string) => {
    return (
        'https://twitter.com/intent/tweet?text=TODO:%20Fill%20in%20this%20template%0A%40AqueductFinance%0A%0ALink:%20&url='
        + link +
        '&hashtags=aqueduct%2Cmoneystreaming%2Crealtimefinance'
    )
}

export default getTweetTemplate;