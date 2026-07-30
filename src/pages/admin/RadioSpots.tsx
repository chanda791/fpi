import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import PrimaryButton from "../../components/admin/PrimaryButton";

import {
  radioSpotService,
  RadioSpot,
} from "../../services/radioSpotService";

export default function RadioSpots() {

  const [spots,setSpots]=useState<RadioSpot[]>([]);
  const [loading,setLoading]=useState(true);

  const load=async()=>{

    try{

      const data=await radioSpotService.getAll();

      setSpots(data);

    }catch(err){

      console.error(err);

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    load();

  },[]);

  const remove=async(id:number)=>{

    if(!window.confirm("Delete this radio spot?")) return;

    await radioSpotService.remove(id);

    load();

  };

  if(loading){

    return(
      <AdminLayout>
        <Loading/>
      </AdminLayout>
    );

  }

  return(

    <AdminLayout>

      <PageHeader
        title="Radio Spots"
        subtitle="Manage radio spot episodes"
      />

      <PageCard>

        <div className="flex justify-end mb-6">

          <Link to="/admin/radio-spots/create">

            <PrimaryButton>

              <Plus size={18}/>

              <span className="ml-2">
                Add Radio Spot
              </span>

            </PrimaryButton>

          </Link>

        </div>

        {spots.length===0 ? (

          <EmptyState
            title="No Radio Spots"
            description="Create your first radio spot."
          />

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Title
                </th>

                <th className="text-left">
                  Station
                </th>

                <th className="text-left">
                  Published
                </th>

                <th className="text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {spots.map((spot)=>(

                <tr
                  key={spot.id}
                  className="border-b"
                >

                  <td className="py-4">

                    {spot.title}

                  </td>

                  <td>

                    {spot.station}

                  </td>

                  <td>

                    {spot.published ? "Yes":"No"}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <Link
                        to="/mil/radio-spots"
                      >

                        <Eye size={18}/>

                      </Link>

                      <Link
                        to={`/admin/radio-spots/${spot.id}/edit`}
                      >

                        <Pencil size={18}/>

                      </Link>

                      <button
                        onClick={()=>remove(spot.id)}
                      >

                        <Trash2
                          size={18}
                          className="text-red-600"
                        />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </PageCard>

    </AdminLayout>

  );

}