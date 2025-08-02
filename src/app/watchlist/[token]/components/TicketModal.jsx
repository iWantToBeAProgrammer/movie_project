import Image from "next/image";
import toast from "react-hot-toast";

export default function TicketModal({ items }) {
  return (
    <div className="modal-box flex flex-col items-center max-w-5xl">
      <div className="modal-title">
        <h2 className="text-2xl font-bold text-center mb-5">Generate Movie Ticket</h2>

        <ul className="steps">
          <li className="step step-primary">Choose Movies</li>
          <li className="step">Choose your theme</li>
          <li className="step">Download</li>
        </ul>
      </div>
      <h3 className="step-title">Choose Movies</h3>
      <p className="my-5 text-sm text-white/40">
        Select 2-4 movies from your watchlist to include in the ticket
      </p>

      <div className="selection-counter p-4 outline-info border-error text-error border rounded-xl" id="selectionCounter">
        Selected: <span id="selectedCount">0</span>/4 movies (minimum 2
        required)
      </div>

      <div className="modal-content">
        <div className="movie-selection">
          {items.map((item) => (
            <div
              key={item.id}
              className="movie-item mt-4 rounded-lg bg-neutral-800 p-4 shadow-lg"
            >
              <input
                type="checkbox"
                id={`movie-${item.id}`}
                name="selectedMovies"
                value={item.id}
                className="hidden"
                onChange={(e) => {
                  const countElement = document.getElementById("selectedCount");
                  const selectionCounter = document.getElementById("selectionCounter");
                  const isChecked = e.target.checked;
                    if (isChecked) {
                        e.target.parentElement.classList.add("bg-primary");
                    } else {
                        e.target.parentElement.classList.remove("bg-primary");
                    }
                  const selectedCount = document.querySelectorAll(
                    'input[name="selectedMovies"]:checked'
                  ).length;
                  countElement.textContent = selectedCount;
                    if (selectedCount < 2) {
                        countElement.classList.add("text-error");
                        selectionCounter.classList.add("text-error");
                        selectionCounter.classList.add("border-error");

                        selectionCounter.classList.remove("text-info");
                        selectionCounter.classList.remove("border-info");
                    } else if (selectedCount > 4) {
                        selectionCounter.classList.add("text-error");
                        selectionCounter.classList.add("border-error");
                        
                        selectionCounter.classList.remove("text-info");
                        selectionCounter.classList.remove("border-info");
                        toast.error("You can only select up to 4 movies.");
                    } else {

                        selectionCounter.classList.remove("text-error");
                        selectionCounter.classList.remove("border-error");
                        countElement.classList.remove("text-error");
                        selectionCounter.classList.add("text-info");
                        selectionCounter.classList.add("border-info");
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

      <div className="modal-action">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  );
}
