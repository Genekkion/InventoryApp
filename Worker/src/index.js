import { Router } from 'itty-router';
import jwt from '@tsndr/cloudflare-worker-jwt';

const router = Router();
const secret = 'secretkey';

// Log in
router.post('/api/users/login', async (request, env, ctx) => {
    if (request.headers.get('Content-Type') !== 'application/json') {
        return new Response('Broken!', { status: 400 });
    }
    const user = await request.json();
    const query = 'SELECT * FROM users WHERE EMAIL = ?1';

    const { DATABASE } = env;
    const statement = DATABASE.prepare(query).bind(user.email);
    const { results } = await statement.all();
    console.log(results);
    if (user.password === results[0].password) {
        const bearerToken = await jwt.sign({
            email: results.email,
            type: results.type,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, secret);
        return new Response(JSON.stringify({
            token: bearerToken
        }));

    } else {
        return new Response('No user found!', { status: 400 });
    }
});

// Get all users
router.get('/api/users', async (request, env, ctx) => {
    const token = request.headers.get('Authorization').slice(7);
    const verified = await jwt.verify(token, secret);
    if (!verified) {
        return new Response('Not allowed here!', { status: 401 });
    }
    const { payload } = jwt.decode(token);
    console.log(payload);
    if (payload.type !== 'ADMIN') {
        return new Response('Not allowed here!', { status: 403 });
    }
    const query = 'SELECT * FROM users;';
    const { DATABASE } = env;
    const statement = DATABASE.prepare(query);
    const { results } = await statement.all();
    return new Response(JSON.stringify(results));
});

// Add new user
router.post('/api/users/register', async (request, env, ctx) => {
    const token = request.headers.get('Authorization').slice(7);
    const verified = await jwt.verify(token, secret);
    if (!verified) {
        return new Response('Not allowed here!', { status: 401 });
    } else if (jwt.decode(token).payload.type !== 'ADMIN') {
        return new Response('Not allowed here!', { status: 403 });
    }

    const user = await request.json();
    const { DATABASE } = env;
    let query = 'INSERT INTO users (firstName, lastName, email, password, type) VALUES (?1, ?2, ?3, ?4, ?5);';
    let statement = DATABASE.prepare(query).bind(user.firstName, user.lastName, user.email, user.password, user.type);
    await statement.run();
    query = 'SELECT * FROM users WHERE EMAIL = ?1';
    statement = DATABASE.prepare(query).bind(user.email);
    const { results } = await statement.all();
    return new Response(JSON.stringify(results[0]));
});

// Update user password
router.put('/api/user', async (request, env, ctx) => {
    const token = request.headers.get('Authorization').slice(7);
    const verified = await jwt.verify(token, secret);
    if (!verified) {
        return new Response('Not allowed here!', { status: 401 });
    }

    const user = await request.json();
    const { DATABASE } = env;
    let query = 'UPDATE users SET password = ?1 WHERE email = ?2;';
    let statement = DATABASE.prepare(query).bind(user.password, user.email);
    await statement.run();
    query = 'SELECT * FROM users WHERE EMAIL = ?1';
    statement = DATABASE.prepare(query).bind(user.email);
    const { results } = await statement.all();
    return new Response(JSON.stringify(results[0]));
});


// Get all inventory
router.get('/api/inventory', async (request, env, ctx) => {
    const token = request.headers.get('Authorization').slice(7);
    const verified = await jwt.verify(token, secret);
    if (!verified) {
        return new Response('Not allowed here!', { status: 401 });
    }
    const { DATABASE } = env;
    const query = 'SELECT * FROM inventory';
    const statement = DATABASE.prepare(query);
    const { results } = await statement.all();
    return new Response(JSON.stringify(results));
});

// Add new item
router.post('/api/inventory', async (request, env, ctx) => {
    const token = request.headers.get('Authorization').slice(7);
    const verified = await jwt.verify(token, secret);
    if (!verified) {
        return new Response('Not allowed here!', { status: 401 });
    }

    const item = await request.json();
    const { DATABASE } = env;
    let query = 'INSERT INTO inventory (id, name, quantity, price, location, shelf, rack) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7);';
    let statement = DATABASE.prepare(query).bind(item.id, item.name, item.quantity, item.price, item.location, item.shelf, item.rack);
    await statement.run();
    query = 'SELECT * FROM inventory WHERE id = ?1';
    statement = DATABASE.prepare(query).bind(item.id);
    const { results } = await statement.all();
    return new Response(JSON.stringify(results[0]));
});

// Update quantity
router.put('/api/inventory/updateQuantity', async (request, env, ctx) => {
    const token = request.headers.get('Authorization').slice(7);
    const verified = await jwt.verify(token, secret);
    if (!verified) {
        return new Response('Not allowed here!', { status: 401 });
    }

    const item = await request.json();
    const { DATABASE } = env;
    let query = 'UPDATE inventory SET quantity = ?1 WHERE id = ?2;';
    let statement = DATABASE.prepare(query).bind(item.quantity, item.id);
    await statement.run();
    query = 'SELECT * FROM inventory WHERE id = ?1';
    statement = DATABASE.prepare(query).bind(item.id);
    const { results } = await statement.all();
    return new Response(JSON.stringify(results[0]));
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
    fetch: router.handle,
};


// router.get('/', () => {
//     return new Response('Hello, how did u find this!');
// });

// router.get('/example/:text', ({ params }) => {
//     // Decode text like "Hello%20world" into "Hello world"
//     let input = decodeURIComponent(params.text);

//     // Serialise the input into a base64 string
//     let base64 = btoa(input);

//     // Return the HTML with the string to the client
//     return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
//         headers: {
//             'Content-Type': 'text/html',
//         },
//     });
// });

// router.post('/post', async request => {
//     // Create a base object with some fields.
//     let fields = {
//         asn: request.cf.asn,
//         colo: request.cf.colo,
//     };

//     // If the POST data is JSON then attach it to our response.
//     if (request.headers.get('Content-Type') === 'application/json') {
//         let json = await request.json();
//         Object.assign(fields, { json });
//     }

//     // Serialise the JSON to a string.
//     const returnData = JSON.stringify(fields, null, 2);

//     return new Response(returnData, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
// });