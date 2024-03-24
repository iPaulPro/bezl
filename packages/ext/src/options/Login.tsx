import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";

const Login = () => {
    return (
        <main style={{fontFamily: 'Inter, "Inter Placeholder", sans-serif'}}>
            <AuthKitProvider>
                <div style={{position: 'fixed', top: '12px', right: '12px'}}>
                    <SignInButton/>
                </div>
                <div style={{paddingTop: '33vh', textAlign: 'center'}}>
                    <Profile/>
                </div>
            </AuthKitProvider>
        </main>
    );
};


function Profile() {
    const profile = useProfile()
    const {
        isAuthenticated,
        profile: {fid, displayName, custody}
    } = profile

    return (
        <>
            {isAuthenticated ? (
                <div>
                    <p>
                        Hello, {displayName}! Your FID is {fid}.
                    </p>
                    <p>
                        Your custody address is: <pre>{custody}</pre>
                    </p>
                </div>
            ) : (
                <p>
                    Click the &quot;Sign in with Farcaster&quot; button above, then scan the QR code
                    to sign in.
                </p>
            )}
        </>
    );
}

export default Login;