import axios from 'axios';

export function parseMessage(message) {
  let errors;
  if (message.length == 3) {
    errors = {
      comparison: false,
      real: message[1].split('').map((x) => x == 1),
      fake: message[2].split('').map((x) => x == 1)
    }
  } else if (message.length == 7) {
    errors = {
      comparison: true,
      A: {
        name: message[1],
        real: message[2].split('').map((x) => x == 1),
        fake: message[3].split('').map((x) => x == 1)
      },
      B: {
        name: message[4],
        real: message[5].split('').map((x) => x == 1),
        fake: message[6].split('').map((x) => x == 1)
      }
    }
  }
  return errors;
}

export function isYoutubeId(id) {
  return axios.get('https://www.googleapis.com/youtube/v3/videos?id='+ id + '&key=AIzaSyCXENXFZ_zJ9tCGnHtci3aRQRSUuzWDY0Y&part=snippet').then(response => {
    if (response.status === 200) {
      if (response.data.pageInfo.totalResults == 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  });
}