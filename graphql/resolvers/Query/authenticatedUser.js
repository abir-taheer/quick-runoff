export default (root, args, {user, signedIn}) => signedIn ? user: null;
