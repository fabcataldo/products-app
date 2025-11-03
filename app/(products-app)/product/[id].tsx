import type { Size } from '@/core/products/interfaces/product.interface';
import ProductImages from '@/presentation/products/components/ProductImages';
import ThemedButtonGroup from '@/presentation/products/components/ThemedButtonGroup';
import { useProduct } from '@/presentation/products/hooks/useProduct';
import { useCameraStore } from '@/presentation/store/useCameraStore';
import MenuIconButton from '@/presentation/theme/components/menu-icon-button';
import ThemedButton from '@/presentation/theme/components/themed-button';
import ThemedTextInput from '@/presentation/theme/components/themed-text-input';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import { Redirect, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';

const ProductScreen = () => {
  const { selectedImages, clearImages  } = useCameraStore();

  const navigation = useNavigation();

  const { id} = useLocalSearchParams();

  const { productQuery, productMutation } = useProduct(`${id}`);

  useEffect(() => {
    return () => {
      clearImages();
    }
  }, [])
  

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MenuIconButton
          onPress={() => router.push('/camera')}
          icon='camera-outline'
        />
      )
    });    
  }, []);

  useEffect(() => {
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
      onSubmit={(productLike) => productMutation.mutate({
        ...productLike,
        images: [...productLike.images, ...selectedImages]
      })}
    >
      {
        ({ values, handleSubmit, handleChange, setFieldValue }) => (

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={productQuery.isFetching}
                  onRefresh={async() => {
                    await productQuery.refetch()
                  }}
                />
              }
            >
              <ProductImages images={[...product.images, ...selectedImages]}/>
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