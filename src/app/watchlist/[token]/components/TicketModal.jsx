import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TicketModal({ items }) {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [step, setStep] = useState(1);

  const handleNextStep = (step) => {
    if (step === 1 && selectedMovies.length < 2) {
      toast.error("Please select at least 2 movies.", {
        position: "top-right",
      });
      return;
    }
    if (step === 1 && selectedMovies.length > 4) {
      toast.error("You can only select up to 4 movies.", {
        position: "top-right",
      });
      return;
    }

    setStep(step + 1);
  };

  const handlePreviousStep = (step) => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="modal-box">
        <h2 className="text-2xl font-bold">No Movies Selected</h2>
        <p className="mt-4">Please add movies to your watchlist first.</p>
      </div>
    );
  }

  console.log("Selected Movies:", selectedMovies);
  console.log("Current Step:", step);

  return (
    <div className="relative modal-box w-11/12 max-w-3xl">
      <div className="modal-title mb-4 flex w-full flex-col items-center rounded-lg p-4 shadow-lg">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Generate Movie Ticket
        </h2>

        <ul className="steps w-full font-semibold">
          <li className={`step step-primary`}>Choose Movies</li>
          <li className={`step ${step >= 2 && "step-primary"} `}>
            Choose your theme
          </li>
          <li className={`step ${step === 3 && "step-primary"} `}>Download</li>
        </ul>
      </div>

      <div
        className="selection-counter rounded-xl bg-error p-4 text-white mt-12"
        id="selectionCounter"
      >
        Selected: <span id="selectedCount">0</span>/4 movies (minimum 2
        required)
      </div>

      <div className="modal-content">
        <div className="movie-selection">
          {items.map((item) => (
            <div
              key={item.id}
              className="movie-item mt-4 rounded-lg bg-neutral-800 p-4 shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in"
            >
              <input
                type="checkbox"
                id={`movie-${item.id}`}
                name="selectedMovies"
                value={item.id}
                className="hidden"
                onChange={(e) => {
                  const countElement = document.getElementById("selectedCount");
                  const selectionCounter =
                    document.getElementById("selectionCounter");
                  const isChecked = e.target.checked;
                  if (isChecked) {
                    e.target.parentElement.classList.add("border");
                  } else {
                    e.target.parentElement.classList.remove("border");
                  }

                  setSelectedMovies(
                    Array.from(
                      document.querySelectorAll(
                        'input[name="selectedMovies"]:checked',
                      ),
                    ).map((input) => input.value),
                  );

                  const selectedCount =
                    selectedMovies.length + (isChecked ? 1 : -1);
                  countElement.textContent = selectedCount;

                  if (selectedCount < 2) {
                    selectionCounter.classList.add("bg-error");

                    selectionCounter.classList.remove("bg-success");
                  } else if (selectedCount > 4) {
                    selectionCounter.classList.add("bg-error");

                    selectionCounter.classList.remove("bg-success");
                    toast.error("You can only select up to 4 movies.");
                  } else {
                    selectionCounter.classList.remove("bg-error");
                    selectionCounter.classList.add("bg-success");
                  }
                }}
              />
              <label
                htmlFor={`movie-${item.id}`}
                className="flex cursor-pointer items-center gap-2"
              >
                <div className="movie-poster">
                  <Image
                    src={
                      item.posterPath
                        ? `${process.env.NEXT_APP_BASEIMG}${item.posterPath}`
                        : "/placeholder.png"
                    }
                    alt={item.title || item.name}
                    width={100}
                    height={150}
                    className="h-36 w-24 rounded-lg object-cover"
                  />
                </div>
                <div className="movie-wrapper flex-1">
                  <div className="movie-title">
                    {item.title || item.name} ({item.releaseDates.split("-")[0]}
                    )
                  </div>
                  <div className="movie-description">
                    <p className="text-sm">
                      {item.overview.length > 100
                        ? item.overview.substring(0, 100) + "..."
                        : item.overview}
                    </p>
                  </div>
                  <div className="movie-metas">
                    {item.genres && item.genres.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {item.genres.map((genre, index) => (
                          <span key={index} className="mr-1">
                            {genre}
                            {index < item.genres.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-action" onClick={() => handleNextStep(step)}>
        <button className="btn btn-lg btn-primary">Next</button>
      </div>
    </div>
  );
}
