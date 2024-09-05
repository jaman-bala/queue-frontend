import PrintProvider from './providers/print-provider/print-provider';
import RoutesProvider from './providers/router/router-provider';

function App() {
    return (
        <PrintProvider>
            <RoutesProvider />
        </PrintProvider>
    );
}

export default App;
