export default (root, args, {user}) => user.signedIn ? user: null;
