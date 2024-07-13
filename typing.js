fetch('./common.json')
    .then((response) => response.json())
    .then((json) => console.log(json.commonWords));