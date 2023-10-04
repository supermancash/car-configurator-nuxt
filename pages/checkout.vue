<script setup>

const {data} = await useFetch('/api/configuration?sessionid=' + useCookie('sessionid').value, {
  method: 'GET',
  headers: {'accept': 'application/json'}
});
console.log(data.value.configuration)


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const openedState = useState('openedState', () => data.value.selectables.componentCategories.map(() => false));

let sum = data.value.modelData.priceInformation.price;
if(data.value.configuration.eqAdd)data.value.configuration.eqAdd.forEach(eq => sum += eq.priceInformation.price);
</script>


<template>
  <div>
    <h1 style="text-align: center">Confirmation page</h1>
    <h2>{{ data.modelData.name }} <span
        style="float: right">Final Price: {{ formatter.format(sum) }}  </span>
    </h2>

    <div v-for="category in data.selectables.componentCategories">

      <br/>
      <h2 @click="() => openedState[data.selectables.componentCategories.findIndex(el=> el.categoryId === category.categoryId)] = !openedState[data.selectables.componentCategories.findIndex(el=> el.categoryId === category.categoryId)]"
          style="border-top: 1px solid">{{ category.categoryName }}
        <span style="float: right">
          {{
            openedState[data.selectables.componentCategories.findIndex(
                el => el.categoryId === category.categoryId)] ? "X" : "↓"
          }}
        </span>
      </h2>
      <div v-if="openedState[data.selectables.componentCategories.findIndex(
                   el => el.categoryId === category.categoryId
                   )]">
        <div v-for="code in Object.entries(data.selectables.vehicleComponents) ">
          <div v-if="code[1].componentType === category.categoryName &&
        !code[1].hidden && !code[1].pseudoCode && code[1].selected && data.configuration.eqRem.findIndex(el => el.id ===
        code[0]) < 0">
            <div style="border-bottom: 1px solid">
              <br/>
              <b>{{ code[0] }}</b>
              - {{ code[1].name }}
              <div style="float: right">
                <b>{{ formatter.format(code[1].priceInformation.price) }}</b>
              </div>
            </div>
          </div>
        </div>

        <div v-for="eq in data.configuration.eqAdd">
          <div v-if="eq.componentType === category.categoryName">
            <div style="border-bottom: 1px solid; color:green">
              <br/>
              <b>+</b>
              <b>{{ eq.id }}</b>
              - {{ eq.name }}
              <div style="float: right">
                <b>{{ formatter.format(eq.priceInformation.netPrice) }}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <br/>
    <br/><br/><br/><br/>
  </div>
</template>

