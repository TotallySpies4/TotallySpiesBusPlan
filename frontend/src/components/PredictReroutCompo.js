import { ReroutingButton } from "./ReroutingButton.js";
import {PredictionDropDown} from "./PredictionDropdown.js";

export const PredictRerouteCompo = () => {
    return ( 
        <div className="flex flex-row space-x-4">
            <ReroutingButton/>
            <PredictionDropDown/>
        </div>
     );
};