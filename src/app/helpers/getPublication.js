async function get(url) {
    let data = null;
    await fetch(url)
        .then(res => res.json())
        .then(body => data = body)
    
    return data;
}