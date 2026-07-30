import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";

import { api } from "../../services/api";

const PressStatements = () => {

  const [items,setItems]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  const load=async()=>{

    const data=await api.get<any[]>("/press-statements");

    setItems(data);

    setLoading(false);

  };

  useEffect(()=>{

    load();

  },[]);

  const remove=async(id:number)=>{

    if(!window.confirm("Delete press statement?")) return;

    await api.delete(`/press-statements/${id}`);

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

        title="Press Statements"

        subtitle="Manage press statements"

      />

      <PageCard>

        <div className="flex justify-end mb-5">

          <Link to="/admin/press-statements/create">

            <PrimaryButton>

              <Plus size={18} className="mr-2"/>

              New Statement

            </PrimaryButton>

          </Link>

        </div>

        {items.length===0? (

          <EmptyState

            title="No Press Statements"

            description="Create your first press statement."

          />

        ):(

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Title</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {items.map(item=>(

                <tr key={item.id} className="border-b">

                  <td className="py-4">

                    {item.title}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">


                      <Link to={`/admin/press-statements/${item.id}/edit`}>

                        <Pencil size={18}/>

                      </Link>

                      <button onClick={()=>remove(item.id)}>

                        <Trash2 size={18} className="text-red-600"/>

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

};

export default PressStatements;