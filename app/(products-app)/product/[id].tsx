import type { Size } from '@/core/products/interfaces/product.interface';
import ProductImages from '@/presentation/products/components/ProductImages';
import ThemedButtonGroup from '@/presentation/products/components/ThemedButtonGroup';
import { useProduct } from '@/presentation/products/hooks/useProduct';
import ThemedButton from '@/presentation/theme/components/themed-button';
import ThemedTextInput from '@/presentation/theme/components/themed-text-input';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const ProductScreen = () => {
  const navigation = useNavigation();

  const { id} = useLocalSearchParams();

  const { productQuery, productMutation } = useProduct(`${id}`);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons name="camera-outline" size={25}/>
      )
    });    
  }, []);

  useEffect(() => {
    console.log('productQuery')
    console.log(productQuery.data)
    if(productQuery.data) {
      navigation.setOptions({
        title: productQuery.data.title
      })
    }
  }, [productQuery.data])
  

  if(productQuery.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={30}/>
      </View>
    )
  }

  if(!productQuery.data){
    return <Redirect href='/(products-app)/(home)'/>
  }

  const product = productQuery.data!;

  return (
    <Formik
      initialValues={product}
      onSubmit={productMutation.mutate}
    >
      {
        ({ values, handleSubmit, handleChange, setFieldValue }) => (

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView>
              <ProductImages images={values.images}/>
              <ThemedView style={{marginHorizontal: 10, marginTop: 20}}>
                <ThemedTextInput
                  placeholder='Título'
                  style={{marginVertical: 5}}
                  value={values.title}
                  onChangeText={handleChange('title')}
                />

                <ThemedTextInput
                  placeholder='Slug'
                  style={{marginVertical: 5}}
                  value={values.slug}
                  onChangeText={handleChange('slug')}
                />

                <ThemedTextInput
                  multiline
                  numberOfLines={5}
                  placeholder='Descripción'
                  style={{marginVertical: 5}}
                  value={values.description}
                  onChangeText={handleChange('description')}
                />
              </ThemedView>

              <ThemedView style={{
                marginHorizontal: 10,
                marginVertical: 5,
                flexDirection: 'row',
                gap: 10
              }}>
                <View style={{flex: 1}}>
                  <ThemedTextInput
                    placeholder='Precio'
                    value={values.price.toString()}
                    onChangeText={handleChange('price')}
                  />
                </View>

                <View style={{flex: 1}}>
                  <ThemedTextInput
                    placeholder='Inventario'
                    value={values.stock.toString()}
                    onChangeText={handleChange('stock')}
                  />
                </View>
              </ThemedView>

              <ThemedView style={{
                marginHorizontal: 10,
              }}>
                <ThemedButtonGroup
                  options={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']}
                  selectedOptions={values.sizes}
                  onSelect={(selectedSize: string) => {
                    const newSizesValue = values.sizes.includes(selectedSize as Size)
                      ? values.sizes.filter(s => s !== selectedSize)
                      : [...values.sizes, selectedSize];

                    setFieldValue(
                      'sizes',
                      newSizesValue
                    );
                  }}
                />

                <ThemedButtonGroup
                  options={['kid', 'men', 'women', 'unisex']}
                  selectedOptions={[values.gender]}
                  onSelect={(selectedOption) =>
                    setFieldValue('gender', selectedOption)
                  }
                />
              </ThemedView>

              {/* boton para guardar */}
              <View style={{
                marginHorizontal: 10,
                marginBottom: 50,
                marginTop: 20
              }}>
                <ThemedButton
                  onPress={() => handleSubmit()}
                  icon='save-outline'
                >
                  Guardar
                </ThemedButton>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )
      }


    </Formik>
    
  )
}

export default ProductScreen;