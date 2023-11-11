## Description
- Usernames are unique
- Peers can connect to other peers using their usernames

## Curls
- Create User
curl -X POST -H "Content-Type: application/json" -d '{"username":"user_x", "password":"pass_x"}' http://localhost:3000/register

- Login
curl -X POST -H "Content-Type: application/json" -d '{"username":"user_1", "password":"pass_1"}' http://localhost:3000/login

- Heartbeat with JWT Token
curl -X POST -H "Content-Type: application/json" -d '{"token":"<token>"}' http://localhost:3000/heartbeat

## Future Improvements
- Hidden users: some usernames should be accessed only with passwords
- Use persistent database
- Send the SDP in a separate request rather than the heartbeat only when it changes on the peer's side
- Establish WebSocket connections with servers rather than using Polling
- Implement authentication and make it a pre for all endpoint calls
- Unify responses to be: {message: 'error or info'} with descriptive status code
- Error handling
- Reorganize files and functions
- Enhance UI
- Consider using keep-alive packet for establishing long-live connections
- If a peer connects to an offline peer, server stores the state and reconnects when online
- Signal encryption keys and encrypt data using them