import { useEffect, useState } from "react";
import API from "../../api/api";

export default function CarsList(){
    const [cars,setCars] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            try{
                const res = await API.get('/cars');
                setCars(res.data);
            }catch(err){
                console.error(err);
                alert('Failed to load cars');
            }finally{
                setLoading(false);
            }
        })();
    },[]);

    async function removeCar(id){
        if(!confirm("Delete this car?")) return;
        try{
            await API.delete(`/cars/${id}`);
            setCars(prev=>prev.filter(c=>c.car_id !== id));
        } catch(err){
            alert("Delete failed");
        }
    }

    if(loading){
        return <div>Loading...</div>
    }
    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <h1 className="text-2xl font-semibold">Cars</h1>
                <Link to='/cars/new' className='ml-auto bg-blue-600 text-white px-3 py-1 rounded'>Add Car</Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {cars.map(car=>(
                    <div key={car.car_id} className="bg-white p-4 rounded shadow">
                        <div className="font-bold">{car.model_name} - {car.type_name}</div>
                        <div className="text-sm text-gray-600">Plate: {car.license_plate}</div>
                        <div className={`mt-2 text-sm ${car.status==='available' ? 'text-green-600': 'text-red-600'}`}>{car.status}</div>
                        <div className="mt-3 flex gap-2">
                            <Link to={`/cars/${car.car_id}/edit`} className='text-sm px-3 py-1 border rounded'>Edit</Link>
                            <button onClick={()=>removeCar(car.car_id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}