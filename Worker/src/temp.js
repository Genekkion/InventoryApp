// const jwt = require('@tsndr/cloudflare-worker-jwt');
const jwt = require('@tsndr/cloudflare-worker-jwt');
const temp = async () => {
    const bearerToken = await jwt.sign({
        email: 'GENEKKION@LIVE.COM',
        type: 'ADMIN',
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, 'secret');

    // console.log(bearerToken);

    console.log(jwt.decode(bearerToken).payload.type)
}

temp();


