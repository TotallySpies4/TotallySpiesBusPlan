import { ReroutingButton } from "./ReroutingButton";
import {PredictionDropDown} from "./PredictionDropdown";

export const PredictRerouteCompo = () => {
    return ( 
        <div className="flex flex-row space-x-4">
            <ReroutingButton/>
            <PredictionDropDown/>
        </div>
     );
};