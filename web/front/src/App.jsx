/* extern */
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>


            {/* Home */}
            <Route path={`/`}                       element={<Home />} />


            {/* Navigation */}
            <Route path={`/ContactUs`}              element={<Navigation>   <ContactUs/>          </Navigation>}/>
            <Route path={`/Morpion`}                element={<Navigation>   <MorpionTraining/>    </Navigation>}/>
            <Route path={`/PrivateMessage`}         element={<Navigation>   <PrivateMessage/>     </Navigation>}/>
            <Route path={`/Profile`}                element={<Navigation>   <Profile/>            </Navigation>}/>
            <Route path={`/Stats`}                  element={<Navigation>   <Stats/>              </Navigation>}/>
            <Route path={`/WaitRoom`}               element={<Navigation>   <WaitRoom/>           </Navigation>}/>


            {/* bad path */}
            <Route path={`/*`}                      element={<Navigation>   <ErrorRedir/>         </Navigation>} />


          </Routes>
        </BrowserRouter>
    </>
  );
}
