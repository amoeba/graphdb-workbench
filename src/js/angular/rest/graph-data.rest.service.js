angular
    .module('graphdb.framework.rest.graphexplore.data.service', [])
    .factory('GraphDataRestService', GraphDataRestService);

GraphDataRestService.$inject = ['$http'];

const CLASS_HIERARCHY_ENDPOINT = 'rest/class-hierarchy';
const DOMAIN_RANGE_ENDPOINT = 'rest/domain-range';
const DEPENDENCIES_ENDPOINT = 'rest/dependencies/';
const EXPORE_GRAPH_ENDPOINT = 'rest/explore-graph/';

function GraphDataRestService($http) {
    return {
        // class hierarchy
        getClassHierarchyData,
        reloadClassHierarchy,
        getClassInstances,

        // domain-range graph
        getDomainRangeData,
        checkDomainRangeData,

        // class relationships
        getRelationshipsData,
        getRelationshipsClasses,
        getRelationshipsStatus,
        calculateRelationships,
        getPredicates,

        // instances graph
        getInstanceNode,
        getInstanceNodeLinks,

        // common
        getRdfsLabelAndComment
    };

    function getClassHierarchyData() {
        return $http.get(CLASS_HIERARCHY_ENDPOINT);
    }

    function reloadClassHierarchy() {
        return $http.get(CLASS_HIERARCHY_ENDPOINT, {
            params: {
                doReload: true
            }
        });
    }

    function getClassInstances(targetUri) {
        return $http.get(`${CLASS_HIERARCHY_ENDPOINT}/class-instances`, {
            params: {
                targetUri
            }
        });
    }

    function checkDomainRangeData(targetUri) {
        return $http.head(DOMAIN_RANGE_ENDPOINT, {
            params: {
                targetUri
            }
        });
    }

    function getDomainRangeData(targetUri, collapsed) {
        return $http.get(DOMAIN_RANGE_ENDPOINT, {
            params: {
                targetUri,
                collapsed
            }
        });
    }

    function getRelationshipsData(selectedClasses, direction) {
        return $http.get(`${DEPENDENCIES_ENDPOINT}matrix`, {
            params: {
                'mode': direction,
                'classes': _.map(selectedClasses, function (c) {
                    return c.name;
                })
            }
        });
    }

    function getRelationshipsClasses(direction) {
        return $http.get(`${DEPENDENCIES_ENDPOINT}classes`, {
            params: {
                'mode': direction
            }
        });
    }

    function getRelationshipsStatus() {
        return $http.get(`${DEPENDENCIES_ENDPOINT}status`);
    }

    function calculateRelationships() {
        return $http.get(`${DEPENDENCIES_ENDPOINT}update`);
    }

    function getPredicates(sourceClass, destinationClass) {
        return $http.get(`${DEPENDENCIES_ENDPOINT}predicates`, {
            params: {
                'from': sourceClass,
                'to': destinationClass,
                'mode': 'all'
            }
        });
    }

    function getInstanceNode(iri) {
        return $http.get(`${EXPORE_GRAPH_ENDPOINT}node`, {
            params: {
                iri
            }
        });
    }

    function getInstanceNodeLinks(iri) {
        return $http.get(`${EXPORE_GRAPH_ENDPOINT}links`, {
            params: {
                iri
            }
        });
    }

    function getRdfsLabelAndComment(targetUri, languages, extraParams) {
        const requestParams = extraParams || {};
        return $http({
            url: 'rest/explore/details',
            method: 'GET',
            params: _.extend(requestParams, {uri: targetUri, languages}),
            headers: {
                'Accept': 'application/json'
            }
        });
    }
}
