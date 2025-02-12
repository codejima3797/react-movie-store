import React from "react";

export default function AboutSection({ aboutRef }) {
  return (
    <div>
      <section id="about__section" ref={aboutRef}>
        <div className="about__container">
          <div className="about__row">
            <h2 className="about__title">About Us</h2>
            <p className="about__para">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              error nisi, sequi officiis officia fuga consectetur magnam
              corporis labore harum aut, inventore commodi. Consectetur quos,
              odio tempora commodi debitis vel, repellat placeat voluptate, ipsa
              corporis explicabo veniam ut! Deserunt debitis error officia
              consequuntur nisi animi, quasi nesciunt velit, facere, quas
              ratione! Mollitia suscipit quasi animi debitis nisi. Numquam quam
              pariatur saepe tenetur, reprehenderit magni. Ratione qui modi
              totam earum consequuntur dolorem obcaecati, repudiandae culpa
              veritatis, blanditiis, iure corporis quas itaque aperiam tenetur.
              Provident dolor eveniet culpa dolorum, cupiditate eum vitae
              voluptatum rerum, minima expedita ipsum placeat ullam pariatur
              quam at!
            </p>
            <br />
            <p className="about__para">
              Nulla iure accusantium esse corrupti error, sint deserunt sequi
              incidunt nam sed sunt reiciendis alias eligendi adipisci!
              Reiciendis veniam odit inventore exercitationem excepturi
              necessitatibus ipsum, in nemo voluptatem officiis at expedita
              illum culpa vero. Beatae perspiciatis ipsam laudantium sequi iure
              veritatis aliquam?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
