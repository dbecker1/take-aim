import ReactGA from 'react-ga';

const stage = window.location.hostname === "localhost" ? "local" : window.location.hostname === "dev.takeaim.app" ? "dev" : "prod";

class GoogleAnalyticsUtils {
    static init() {
        if (stage === "prod") {
            ReactGA.initialize('UA-162789074-1', { debug: false });
        }
    }

    static set(obj) {
        if (stage === "prod") {
            ReactGA.set(obj);
        }
    }

    static pageview(page) {
        if (stage === "prod") {
            ReactGA.pageview(page);
        }
    }

    static event(obj) {
        if (stage === "prod") {
            ReactGA.event(obj);
        }
    }
}

export default GoogleAnalyticsUtils