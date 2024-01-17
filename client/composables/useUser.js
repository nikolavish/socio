export default () => {
  const userData = useCookie("User-Data");
  
  const user = useState("user", () => userData.value);
  watch(()=>userData, () => {
    console.log(userData.value);
    user.value = userData.value;
  });
  onMounted(()=>{
    user.value = userData.value;
  })

  return user;
};
