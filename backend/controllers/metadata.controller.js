//pull file from a url and convert to mp3
const axios = require('axios');
const blob = require('blob');
const fs = require('fs');

exports.getMp3 = async (req, res) => {
    const response = await axios({
        method: 'GET',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        responseType: 'blob'
    });


    //convert blob to mp3
    const blob = new Blob([response.data], { type: 'audio/mpeg' });
    
}
