import { useFormContext } from 'react-hook-form';

export default function LabelInputLogin({ label, name, type, validationRules, ...rest }) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <div>
      <label htmlFor={name} className="block text-gray-700">{label}</label>
      <input
        {...register(name, validationRules)}
        id={name}
        type={type}
        disabled={isSubmitting}
        className={`w-full p-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-400`}
        {...rest}
      />
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1" data-cy="label_input_error">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}