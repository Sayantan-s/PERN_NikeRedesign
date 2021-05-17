import { Navbar, Footer } from "layout";
import { Admin, Collections, Home } from "pages";
import { useEffect } from "react";
import { BrowserRouter as Switch,Route } from 'react-router-dom'

function App() {
  useEffect(() => {
    const rootElement = document.getElementById('root');
    rootElement.className = "overflow-x-hidden font-body font-normal text-gray-400 bg-gray-50";
  },[])

  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/collectives" component={Collections} />
        <Route path="/admin" component={Admin} />
      </Switch>
      <Footer />
    </>
  );
}

export default App;
 