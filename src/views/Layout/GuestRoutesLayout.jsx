import { axiosMain } from 'http/axios/axios_main';
import SetTokenInterval from 'hoc/SetTokenHeader/SetTokenHeader';


function GuestRoutesLayout({ children }) {
  return (
    <div className="main_body">    
      {children}
    </div>
  );
}

export default SetTokenInterval(GuestRoutesLayout, axiosMain);