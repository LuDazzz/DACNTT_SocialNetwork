import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";

const DialogPost = ({ visible, onHide, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitPost = (data) => {
    onsubmit(data.content);
  };

  const headerElement = (
    <div className="flex justify-center items-center shadow-2xl">
      <div className="font-bold text-sm">New Post</div>
    </div>
  );

  const footerElement = (
    <div>
      <Button
        label="Post"
        unstyled
        className="font-semibold text-sm py-2 px-3"
      />
    </div>
  );

  return (
    <>
      <Dialog
        visible={visible}
        onHide={onHide}
        className=" aria-hidden:true"
        content={() => (
          <div className="flex flex-col w-700 h-64 bg-white border rounded-3xl">
            <div className="h-1/4 bg-green-100 flex items-center justify-center rounded-t-3xl">
              <div className="font-bold">Create New Post</div>
            </div>
            <div className="h-1/2">
              <form onSubmit={handleSubmit(handleSubmitPost)}>
                <div>
                  <InputText
                    unstyled
                    placeholder="Post what you want!"
                    className="focus:outline-none"
                  />
                </div>
              </form>
            </div>
            <div className=" bg-green-100 h-1/4 rounded-b-3xl">footer</div>
          </div>
        )}
      ></Dialog>
    </>
  );
};

export default DialogPost;
