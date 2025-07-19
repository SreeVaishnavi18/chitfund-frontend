import React from 'react';
import ReactDOM from 'react-dom/client';
import OTPFlow from 'raj-otp';

class RajOtpWrapper extends HTMLElement {
  root: ReactDOM.Root;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    shadowRoot.appendChild(mountPoint);
    this.root = ReactDOM.createRoot(mountPoint);
  }

  connectedCallback() {
    const secretKey = this.getAttribute('secretKey') || '';
    const apiEndpoint = this.getAttribute('apiEndpoint') || '';
    const initialTheme = this.getAttribute('initialTheme') || 'light';

    const onComplete = (data: any) => {
      this.dispatchEvent(new CustomEvent('otpComplete', {
        detail: data,
        bubbles: true,
        composed: true
      }));
    };

    const onSuccess = () => console.log("OTP success");
    const onError = (err: any) => console.error("OTP error:", err);

    const customTheme = {
      primaryColor: "#007bff",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      inputBorderColor: "#ccc"
    };

    this.root.render(
      <OTPFlow
            secretKey="D783998E4CD954CD107F37F0298F7D0A"
            apiEndpoint="http://192.168.237.43:3002/api/check-otp-availability"
            onComplete={(data: any) => {
            console.log("Flow update:", data);
            if (data.stage === 'verified') {
                console.log("Mobile:", data.mobile);
                console.log("OTP Verified!");
            } else if (data.stage === 'submitted') {
                console.log("User entered mobile:", data.mobile);
            } else if (data.stage === 'error') {
                console.log("OTP error:", data.error);
            }
            }}
            onSuccess={() => {
            console.log("OTP verification successful!");
            }}
            onError={(error: any) => {
            console.error("OTP flow error:", error);
            }}
            initialTheme="light"
            customTheme={{
            primaryColor: "#007bff",
            backgroundColor: "#ffffff",
            textColor: "#000000",
            inputBorderColor: "#ccc"
            }}
          />
    );
  }

  disconnectedCallback() {
    this.root.unmount();
  }
}

customElements.define('raj-otp-wrapper', RajOtpWrapper);