window.onload = function() {
        document.querySelector('main[class="my-5"]').style.display = 'none';

        document.getElementById("submit").onclick = async function(event) {
            event.preventDefault();
            try {
                var postcode = document.querySelector('[id="postcode"]').value;
                console.log('This is the postcode', postcode);

                // Get the postcode constituency
                var response = await getConstituency(postcode);
                console.log('response', response);

                if (response.status === 200) {
                    console.log('result', response.result);

                    // Fetch the constituency data related to the return parliamentary_constituency
                    var parliamentary_constituency = response.result.parliamentary_constituency;
                    console.log('parliamentary_constituency to search', parliamentary_constituency);

                    if (!!parliamentary_constituency) {

                        fetch('./resources/data.json')
                            .then(response => response.json())
                            .then(data => {
                                // Search for the constituency based on the postcode
                                var constituencyFound = false;
                                for (var i = 0; i < data.length; i++) {
                                    // console.log(data[i].parliamentary_constituency);
                                    if (data[i].parliamentary_constituency === parliamentary_constituency) {
                                        console.log('Constituency found', data[i].parliamentary_constituency);
                                        console.log('found it', data[i]);
                                        var constituency = data[i].parliamentary_constituency;
                                        var mp_email = data[i].mp_email;
                                        var mp_name = data[i].mp_name;
                                        var mp_image = data[i].mp_image;
                                        var message = `Your constituency is ${constituency} and your MP is ${mp_name}`;

                                        document.querySelector('main[class="my-5"] h2[class="mb-5"]').textContent = message;
                                        document.querySelector('main[class="my-5"] img[class="img-fluid"]').src = mp_image;
                                        document.querySelector('main[class="my-5"] div[class="card-body"] a').href = `mailto:${mp_email}`;

                                        document.querySelector('main[class="my-5"]').style.display = 'block';
                                        document.querySelector('main[class="my-5"] img[class="img-fluid"]').style.display = 'inline';
                                        document.querySelector('main[class="my-5"] div[class="card-body"]').style.display = 'block';
                                        return;
                                    }
                                }
                                if (!constituencyFound) {
                                    document.querySelector('main[class="my-5"] h2[class="mb-5"]').textContent = 'No constituency';
                                    document.querySelector('main[class="my-5"]').style.display = 'block';
                                    document.querySelector('main[class="my-5"] img[class="img-fluid"]').style.display = 'none';
                                    document.querySelector('main[class="my-5"] div[class="card-body"]').style.display = 'none';
                                    console.log('No constituency');
                                }
                            });
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    /**
     * Get the constituency details based on the postcode entry
     * @param {*} postcode 
     * @returns 
     */
async function getConstituency(postcode) {
    console.log(postcode);
    const url = 'https://api.postcodes.io/postcodes/' + encodeURIComponent(postcode);
    var requestOptions = {
        redirect: 'follow'
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}