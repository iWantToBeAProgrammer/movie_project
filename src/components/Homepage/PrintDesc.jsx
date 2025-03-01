import Image from "next/image";
import React from "react";

const PrintDesc = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="top-content flex font-raleway gap-10">
        <div className="print-image">
          <Image
            src={"/assets/images/print-image-1.png"}
            width={1080}
            height={1080}
            alt="print-image"
          />
        </div>
        <div className="desc-print">
          <h1 className="text-6xl font-bebas_neue">PRINT FEATURES</h1>
          <p className="text-primary text-3xl">
            Your Movie Watchlist, Now Printable!
          </p>
          <p className="mt-10 text-lg">
            Easily keep track of the movies you want to watch! With our new
            Print Watchlist feature, you can print your favorite movie list
            directly from the website. Stay organized and never miss a
            must-watch film!
          </p>
        </div>
      </div>
      <div className="bot-content flex font-raleway gap-10">
        <div className="desc-print">
          <p className="text-primary text-3xl">Why Print Your Watchlist?</p>
          <ul className="text-lg gap-6 flex flex-col mt-5">
            <li className="flex gap-2">
              <p>•</p>
              <p>
                <span className="font-bold">Access Anywhere:</span> Take your
                list of favorite films with you, in physical form. Perfect for
                jotting down notes or sharing with friends!
              </p>
            </li>
            <li className="flex gap-2">
              <p>•</p>
              <p>
                <span className="font-bold">Neat & Easy to Read:</span> Get all
                the essential movie info—titles, genres, release dates—laid out
                clearly for effortless selection.
              </p>
            </li>
            <li className="flex gap-2">
              <p>•</p>
              <p>
                <span className="font-bold">Stay Updated: </span> Add the latest
                releases to your watchlist and print whenever you need a quick
                reference.
              </p>
            </li>
          </ul>
        </div>
        <div className="print-image">
          <Image
            src={"/assets/images/print-image-2.png"}
            width={400}
            height={760}
            alt="print-image"
          />
        </div>
      </div>
    </div>
  );
};

export default PrintDesc;
