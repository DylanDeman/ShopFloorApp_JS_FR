import { IoInformationCircleOutline } from 'react-icons/io5';

const Information = ({ info }) => {
  return (
    <div className="border px-4 py-2 rounded-md">
      <div className="flex items-center">
        <IoInformationCircleOutline className="text-2xl w-12"/>
        <p className="ml-2">{info}</p>
      </div>
    </div>
  );
};

export default Information;