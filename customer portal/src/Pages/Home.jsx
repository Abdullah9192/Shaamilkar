import React , { useState } from 'react'
import Disclaimer from '../Components/DisclaimerModal/Disclaimer'
import { Button } from 'react-bootstrap';
import TermsAndConditions from '../Components/TermsAndConditionsModal/TermsAndConditions';
import Categories from './Categories/Categories';
import HeroSlider from '../Components/HeroSlider/HeroSlider';
import Products from './Products/Products';
import Navbar from '../Components/Navbar/Navbar';

const Home = () => {
const [modalShow, setModalShow] = React.useState(true);
const [showModal, setShowModal] = useState(false);
const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  return (
    <>
      <Navbar />
      <HeroSlider/>
      <div style={{padding:"0 1%",}}>
      {/* <Disclaimer
       show={modalShow}
       onHide={() => setModalShow(false)}
       /> */}
      <Categories/>
      <Products/>
       </div>
    </>
  )
}

export default Home
