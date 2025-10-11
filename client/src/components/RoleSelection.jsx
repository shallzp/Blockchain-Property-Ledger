import { Shield, User, CheckCircle } from "lucide-react";

const RoleSelection = ({ selectedRole, onRoleSelect }) => {
  const roles = [
    {
      id: 'RegionalAdmin',
      value: '2',
      name: 'Regional Admin',
      description: 'Verify property documents and KYC. Approve land listings.',
      icon: Shield,
      color: 'blue',
      approval: 'Requires Super Admin approval'
    },
    {
      id: 'User',
      value: '3',
      name: 'User',
      description: 'Register and manage your properties. List properties for sale.\nBrowse and purchase properties. Send purchase requests.',
      icon: User,
      color: 'purple',
      approval: 'Requires Regional Admin verification'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Role</h2>
      <div className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;
          
          return (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role.value)}
              className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-orange-500' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isSelected ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {role.approval}
                    </div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelection;