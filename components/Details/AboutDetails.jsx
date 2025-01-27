import Image from "@node_modules/next/image";
import React from "react";

const AboutDetails = () => {
  return (
    <>
      <div className=" w-12/12 flex justify-between">
        <div className="w-6/12 flex flex-col justify-center items-center gap-4">
          <div className="relative w-6/12 h-auto">
            {/* Background Overlay */}
            <div className="absolute top-0 left-0 w-full h-full translate-x-7 -translate-y-7 bg-bgDarkColor"></div>

            {/* Image Container */}
            <div className="relative w-full h-auto">
              <img
                src="/image/manager.jpg"
                alt="photo"
                className="w-full h-auto  shadow-lg"
              />
            </div>
          </div>

          <div>
            <h1>CEO</h1>
          </div>
        </div>
        <div className="w-6/12  flex flex-col justify-center items-center gap-4 p-6">
          <p className="text-base">
            The United Nations is an international organization founded in 1945.
            Currently made up of 193 Member States, the UN and its work are
            guided by the purposes and principles contained in its founding
            Charter. The UN has evolved over the years to keep pace with a
            rapidly changing world. But one thing has stayed the same: it
            remains the one place on Earth where all the world's nations can
            gather together, discuss common problems, and find shared solutions
            that benefit all of humanity. The Secretary-General is Chief
            Administrative Officer of the UN - and is also a symbol of the
            Organization's ideals and an advocate for all the world's peoples,
            especially the poor and vulnerable. The Secretary-General is
            appointed by the General Assembly on the recommendation of the
            Security Council for a 5-year, renewable term. The current
            Secretary-General, and the 9th occupant of the post, is António
            Guterres of Portugal, who took office on 1 January 2017. On the 18th
            of June, 2021, Guterres was re-appointed to a second term, pledging
            as his priority to continue helping the world chart a course out of
            the COVID-19 pandemic. The United Nations is an international
            organization founded in 1945. Currently made up of 193 Member
            States, the UN and its work are guided by the purposes and
            principles contained in its founding Charter. The UN has evolved
            over the years to keep pace with a rapidly changing world. But one
            thing has stayed the same: it remains the one place on Earth where
            all the world's nations can gather together, discuss common
            problems, and find shared solutions that benefit all of humanity.
            The Secretary-General is Chief Administrative Officer of the UN -
            and is also a symbol of the Organization's ideals and an advocate
            for all the world's peoples, especially the poor and vulnerable. The
            Secretary-General is appointed by the General Assembly on the
            recommendation of the Security Council for a 5-year, renewable term.
            The current Secretary-General, and the 9th occupant of the post, is
            António Guterres of Portugal, who took office on 1 January 2017. On
            the 18th of June, 2021, Guterres was re-appointed to a second term,
            pledging as his priority to continue helping the world chart a
            course out of the COVID-19 pandemic.
          </p>
        </div>
      </div>
      <div className="w-12/12 flex justify-center items-center">
        <h1 className="text-4xl">Clients</h1>
      </div>
    </>
  );
};

export default AboutDetails;
