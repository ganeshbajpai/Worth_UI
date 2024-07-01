import React from 'react';
import { ListGroup, ListGroupItem, UncontrolledCarousel} from 'reactstrap';


    
 
const Home=()=>{
  

return(


<div >

  

<UncontrolledCarousel
  items={[
    {
      altText: 'Slide 1',
      caption: 'Slide 1',
      key: 1,
      src: 'https://picsum.photos/id/123/1200/600'
    },
    {
      altText: 'Slide 2',
      caption: 'Slide 2',
      key: 2,
      src: 'https://picsum.photos/id/456/1200/600'
    },
    {
      altText: 'Slide 3',
      caption: 'WelCome To My TrackApplication',
      key: 3,
      src: 'https://picsum.photos/id/678/1200/600'
    }
  ]}
 />










</div>

);

};
export default Home;