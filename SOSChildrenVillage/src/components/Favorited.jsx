import { useState } from "react";

function FavoriteColor() {
  const [color, setColor] = useState("blue");

  return(
    <>
    
    <div>{color}</div>
    <button onClick={() => setColor("red")}>Change Color</button>

    <button onClick={() => setColor("green")}>Change Color</button>

    </>
  );
}

export default FavoriteColor