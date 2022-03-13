async function getData(url) {
    const response = await fetch(url);
  
    return response.json();
  }
  
user = await getData('api/authenticate');

export default user;