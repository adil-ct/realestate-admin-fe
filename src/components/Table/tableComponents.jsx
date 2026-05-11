import { Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import toaster from 'utils/toaster';

export const NavigationLabel = (item, link, title) => !item?.external ? <Link to={item?.link || link}>{item?.title || title}</Link> : 
  <a href={item?.link || link} rel="noreferrer" target='_blank'>{item?.title || title}</a>

export const MultiProgress = ({success = 40, light = 0, danger = 40}) => {
  const total = light || (success+danger);
  const successVal = Math.floor((success/total)*100);
  const dangerVal = danger && Math.floor((danger/total)*100) || 0;
  const lightVal = Math.floor(((light - (success+danger))/total)*100);
  return <div>
      <Progress multi className="progress-vote">
        <Progress bar value={successVal} color="success">{success|| ""}</Progress>
        <Progress bar value={lightVal} color="light">{light || 0}</Progress>
        <Progress bar value={dangerVal} color="danger">{danger||""}</Progress>
      </Progress>
  </div> 
}
const copyToCLipBoard = value => {
  try {
    navigator.clipboard.writeText(value);
    toaster.success('Copied to clipboard!');
  } catch (err) {
    // console.log(err);
  }
};
export const ClickToCopy = (obj) => <span className='pointer' onClick={() => copyToCLipBoard(obj?.copyText)}>{obj?.displayText}</span>
