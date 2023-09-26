<script setup>
const count = useState('count', () => 0);
const {data} = await useFetch('/api/configuration', {method: 'GET', headers: {'accept': 'application/json'}});

const sessionid = useCookie('sessionid');


const equipmentAdded = useState('equipmentAdded', () => []);
const equipmentRemoved = useState('equipmentRemoved', () => []);


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


const handleCheckBoxChange = (e, code, category) => {
  if (code.selected && !e.currentTarget.checked) {
    if (category.cardinality === "EXACTLY_ONE") {
      alert("You must choose at least one type of " + category.categoryName);
      return document.getElementById(code.id).checked = true;
    }
    equipmentRemoved.value.push(code);
  }

  if (code.selected && e.currentTarget.checked) {
    if (category.cardinality === "EXACTLY_ONE") {
      const index = equipmentAdded.value.findIndex(el => el.componentType === category.categoryName);
      if (index > -1) {
        document.getElementById(equipmentAdded.value[index].id).checked = false
        equipmentAdded.value.splice(index, 1);
      }
    }
    equipmentRemoved.value.splice(equipmentRemoved.value.indexOf(code), 1);
  }


  if (!code.selected && e.currentTarget.checked) {
    if (category.cardinality === "EXACTLY_ONE") {
      console.dir(equipmentAdded.value)
      const index = equipmentAdded.value.findIndex(el => el.componentType === category.categoryName);
      if (index > -1) document.getElementById(equipmentAdded.value.splice(index, 1)[0].id).checked = false;
      if (index === -1) {
        equipmentRemoved.value.push(Object.entries(data.value.selectables.vehicleComponents).filter(
            el => el[1].selected === true && category.categoryName === el[1].componentType)[0][1]);
        document.getElementById(
            Object.entries(data.value.selectables.vehicleComponents).filter(
                el => el[1].selected === true && category.categoryName === el[1].componentType)[0][0]
        ).checked = false;
      }
    }
    equipmentAdded.value.push(code);
  }

  if (!code.selected && !e.currentTarget.checked) {
    if (category.cardinality === "EXACTLY_ONE") {
      document.getElementById(
          Object.entries(data.value.selectables.vehicleComponents).filter(
              el => el[1].selected === true && category.categoryName === el[1].componentType)[0][0]
      ).checked = true;
    }
    equipmentAdded.value.splice(equipmentAdded.value.findIndex(el => el.id === code.id), 1);
  }
  console.log(equipmentAdded.value);
  console.log(equipmentRemoved.value)

}

const handleProceed = async (e) => {
  await fetch('/api/configuration', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      sessionid: data.value.sessionid,
      equipmentAdded: equipmentAdded.value,
      equipmentRemoved: equipmentRemoved.value
    })
  });
  window.location = "/checkout";
}
</script>


<template>
  <div>
    <h1 style="text-align: center">Configuration page</h1>
    <img style="width: 90vw; display: block;margin-left: auto;margin-right: auto;"
         src="~/assets/mercedes.jpeg" alt="Picture of a mercedes">
    <h1>{{ data.modelData.name }}</h1>
    <div v-for="category in data.selectables.componentCategories">
      <br/>
      <h2>{{ category.categoryName }}</h2>
      <div v-for="code in Object.entries(data.selectables.vehicleComponents)">
        <div v-if="code[1].componentType === category.categoryName && !code[1].hidden && !code[1].pseudoCode">
          <div style="border-bottom: 1px solid">
            <br/>
            <b>{{ code[0] }}</b>
            - {{ code[1].name }}
            <div style="float: right">
              <b>{{ formatter.format(code[1].priceInformation.price) }}</b>
              <input
                  type="checkbox"
                  :id="code[0]"
                  :checked="code[1].selected"
                  @change="(e) => handleCheckBoxChange(e, code[1], category)"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
    <br/>
    <button style="float: right" @click="handleProceed">Proceed to Checkout</button>
    <br/><br/><br/><br/>
  </div>
</template>




