import ClipLoader from "react-spinners/ClipLoader"

export default function Loader() {
  return (
    <div className="flex justify-center gap-1">
          Loading <ClipLoader color="white" size="25px" />
    </div>
  );
}