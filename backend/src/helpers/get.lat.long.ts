import nodeGeocoder from "node-geocoder";

export const getLatLong = async (address: string): Promise<Array<number>> => {
    let options: nodeGeocoder.Options = {
        provider: 'openstreetmap'
    };
    let geoCoder = nodeGeocoder(options);
    const res = await geoCoder.geocode(address);
    return [res[0].latitude!, res[0].longitude!]
};