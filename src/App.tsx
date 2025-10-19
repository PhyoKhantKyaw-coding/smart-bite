import Wrapper from "./components/Wrapper";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "@/configs/locale";
import "@/configs/axios";

const GOOGLE_CLIENT_ID = '758570961714-gbt9gun7g7dm1kfbm5b8oe8ujl9ti5te.apps.googleusercontent.com';

const App = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Wrapper />
        </GoogleOAuthProvider>
    );
};

export default App;
