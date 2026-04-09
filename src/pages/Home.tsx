import React from 'react';
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedProducts from "@/components/FeaturedProducts";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Map from "@/components/Map";
import Contact from "@/components/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProducts />
      <Gallery />
      <Reviews />
      <Map />
      <Contact />
    </>
  );
};

export default Home;
